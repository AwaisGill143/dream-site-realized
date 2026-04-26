import axios, { AxiosInstance, AxiosError } from 'axios';

// API client configuration
const API_URL = 'https://se-backend-1-6hgd.onrender.com';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000');

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Don't override Content-Type for FormData (let axios set it with boundary)
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - try to refresh token
        if (error.response?.status === 401 && originalRequest && !originalRequest.headers['X-Retry']) {
          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await this.client.post('/api/v1/users/refresh', {
                refresh_token: refreshToken,
              });

              const { access_token, refresh_token } = response.data;
              localStorage.setItem('access_token', access_token);
              localStorage.setItem('refresh_token', refresh_token);

              // Retry original request with new token
              originalRequest.headers['X-Retry'] = 'true';
              originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Authentication endpoints
  register(email: string, username: string, fullName: string, password: string) {
    return this.client.post('/api/v1/users/register', {
      email,
      username,
      full_name: fullName,
      password,
    });
  }

  login(email: string, password: string) {
    return this.client.post('/api/v1/users/login', {
      email,
      password,
    });
  }

  getCurrentUser() {
    return this.client.get('/api/v1/users/me');
  }

  // Job Parser endpoints
  analyzeJob(jobDescription: string, jobUrl?: string) {
    return this.client.post('/api/v1/jobs/analyze', {
      job_description: jobDescription,
      job_url: jobUrl,
    });
  }

  getJobAnalysis(analysisId: number) {
    return this.client.get(`/api/v1/jobs/${analysisId}`);
  }

  getMyJobAnalyses() {
    return this.client.get('/api/v1/jobs/user/my-analyses');
  }

  getReadinessScore(analysisId: number) {
    return this.client.get(`/api/v1/jobs/${analysisId}/readiness-score`);
  }

  // Skill Gap Analysis endpoints
  analyzeSkillGaps(jobAnalysisId: number, resumeId?: number) {
    return this.client.get(`/api/v1/jobs/${jobAnalysisId}/skill-gap-analysis`, {
      params: { resume_id: resumeId }
    });
  }

  getLearningRecommendations(jobAnalysisId: number) {
    return this.client.get(`/api/v1/jobs/${jobAnalysisId}/learning-recommendations`);
  }

  explainConcept(skillName: string, level: string = 'beginner') {
    return this.client.post(`/api/v1/jobs/concepts/${skillName}/explain`, {
      level
    });
  }

  // Resume endpoints
  uploadResume(file: File, isPrimary: boolean = true) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('is_primary', isPrimary.toString());
    
    return this.client.post('/api/v1/users/me/resume/upload', formData);
  }

  getPrimaryResume() {
    return this.client.get('/api/v1/users/me/resume/primary');
  }

  getMyResumes() {
    return this.client.get('/api/v1/users/me/resume');
  }

  // Assessment endpoints
  createAssessment(assessmentType: string, jobAnalysisId?: number, difficulty?: string) {
    return this.client.post('/api/v1/assessments', {
      assessment_type: assessmentType,
      job_analysis_id: jobAnalysisId,
      difficulty,
    });
  }

  createAssessmentFromSkills(skills: string[], numQuestions: number) {
    return this.client.post('/api/v1/assessments', {
      title: `${skills.slice(0, 2).join(' & ')} Assessment`,
      assessment_type: 'mcq',
      skill_focus: skills.join(', '),
      skills,
      num_questions: numQuestions,
    });
  }

  submitAssessmentWithAnswers(assessmentId: number, answers: Record<number, number>) {
    return this.client.post(`/api/v1/assessments/${assessmentId}/submit`, { answers });
  }

  getAssessment(assessmentId: number) {
    return this.client.get(`/api/v1/assessments/${assessmentId}`);
  }

  getMyAssessments() {
    return this.client.get('/api/v1/assessments');
  }

  submitAssessmentAnswer(assessmentId: number, questionId: number, answer: string) {
    return this.client.post(`/api/v1/assessments/${assessmentId}/submit`, {
      question_id: questionId,
      answer,
    });
  }

  submitAssessment(assessmentId: number) {
    return this.client.post(`/api/v1/assessments/${assessmentId}/complete`, {});
  }

  logPerformance(activityType: string, score?: number, timeTakenSeconds?: number, skillTags?: string[]) {
    return this.client.post('/api/v1/analytics/performance', {
      activity_type: activityType,
      score,
      time_taken_seconds: timeTakenSeconds,
      skill_tags: skillTags || [],
    });
  }

  getPerformanceStats() {
    return this.client.get('/api/v1/analytics/performance/stats');
  }

  // Learning Path endpoints
  createLearningPath(jobAnalysis: any) {
    return this.client.post('/api/v1/learning-paths', {
      job_title: jobAnalysis.job_title,
      required_skills: jobAnalysis.required_skills,
      skill_gaps: jobAnalysis.skill_gaps,
    });
  }

  generateLearningPath(jobAnalysisId: number) {
    return this.client.post('/api/v1/learning-paths', {
      job_analysis_id: jobAnalysisId,
    });
  }

  getLearningPath(pathId: number) {
    return this.client.get(`/api/v1/learning-paths/${pathId}`);
  }

  getMyLearningPaths() {
    return this.client.get('/api/v1/learning-paths');
  }

  updateLearningProgress(pathId: number, resourceId: number, status: string) {
    return this.client.put(`/api/v1/learning-paths/${pathId}/resources/${resourceId}`, {
      status,
    });
  }

  // Interview endpoints
  startInterview(jobAnalysisId?: number, title?: string) {
    return this.client.post('/api/v1/interviews', {
      title: title || 'Mock Interview',
      job_analysis_id: jobAnalysisId,
      duration_minutes: 30,
    });
  }

  getInterview(interviewId: number) {
    return this.client.get(`/api/v1/interviews/${interviewId}`);
  }

  getMyInterviews() {
    return this.client.get('/api/v1/interviews');
  }

  submitInterviewResponse(interviewId: number, response: string) {
    return this.client.post(`/api/v1/interviews/${interviewId}/respond`, {
      message: response,
    });
  }

  endInterview(interviewId: number) {
    return this.client.post(`/api/v1/interviews/${interviewId}/end`, {});
  }

  // Analytics endpoints
  getAnalytics() {
    return this.client.get('/api/v1/analytics');
  }

  getSkillAnalytics() {
    return this.client.get('/api/v1/analytics/skills');
  }

  getProgressAnalytics() {
    return this.client.get('/api/v1/analytics/progress');
  }

  // Health check
  healthCheck() {
    return this.client.get('/api/v1/health');
  }
}

export const apiClient = new APIClient();
export default apiClient;
