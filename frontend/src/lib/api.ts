import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (data: {
    email: string;
    password: string;
    name: string;
    role: 'STUDENT' | 'DOCTOR';
  }) => api.post('/auth/register', data),
  
  logout: () => {
    const refreshToken = localStorage.getItem('refreshToken');
    return api.post('/auth/logout', { refreshToken });
  },
  
  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
};

// User API
export const userApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: { name?: string; bio?: string }) =>
    api.put('/users/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/users/change-password', data),
  getStudentStats: () => api.get('/users/student/stats'),
  getDoctorStats: () => api.get('/users/doctor/stats'),
};

// Courses API
export const coursesApi = {
  getAll: (params?: { category?: string; search?: string; page?: number }) =>
    api.get('/courses', { params }),
  getById: (id: string) => api.get(`/courses/${id}`),
  getCategories: () => api.get('/courses/categories'),
  
  // Doctor only
  getMyCourses: () => api.get('/courses/doctor/my-courses'),
  create: (data: {
    title: string;
    description: string;
    category: string;
    price: number;
    thumbnailUrl?: string;
  }) => api.post('/courses/doctor', data),
  update: (id: string, data: Partial<{
    title: string;
    description: string;
    category: string;
    price: number;
    thumbnailUrl: string;
    published: boolean;
  }>) => api.put(`/courses/doctor/${id}`, data),
  delete: (id: string) => api.delete(`/courses/doctor/${id}`),
};

// Lessons API
export const lessonsApi = {
  getCourseModules: (courseId: string) =>
    api.get(`/lessons/course/${courseId}/modules`),
  
  // Student
  getLesson: (lessonId: string) => api.get(`/lessons/student/${lessonId}`),
  
  // Doctor only
  createModule: (data: {
    courseId: string;
    title: string;
    description?: string;
    order?: number;
  }) => api.post('/lessons/doctor/module', data),
  updateModule: (id: string, data: { title?: string; description?: string }) =>
    api.put(`/lessons/doctor/module/${id}`, data),
  deleteModule: (id: string) => api.delete(`/lessons/doctor/module/${id}`),
  createLesson: (data: {
    moduleId: string;
    title: string;
    type: 'VIDEO' | 'ARTICLE' | 'QUIZ';
    content?: string;
    videoUrl?: string;
    duration?: number;
    isFree?: boolean;
    order?: number;
  }) => api.post('/lessons/doctor/lesson', data),
  updateLesson: (id: string, data: Partial<{
    title: string;
    content: string;
    videoUrl: string;
    duration: number;
    isFree: boolean;
  }>) => api.put(`/lessons/doctor/lesson/${id}`, data),
  deleteLesson: (id: string) => api.delete(`/lessons/doctor/lesson/${id}`),
};

// Quizzes API
export const quizzesApi = {
  getCourseQuizzes: (courseId: string) => api.get(`/quizzes/course/${courseId}`),
  getQuiz: (quizId: string) => api.get(`/quizzes/${quizId}`),
  
  // Student
  submitQuiz: (quizId: string, answers: { questionId: string; selectedOptionId: string }[]) =>
    api.post(`/quizzes/student/${quizId}/submit`, { answers }),
  getMyResults: () => api.get('/quizzes/student/results'),
  getAttempt: (attemptId: string) => api.get(`/quizzes/student/attempt/${attemptId}`),
  
  // Doctor only
  create: (data: {
    courseId: string;
    lessonId?: string;
    title: string;
    description?: string;
    passingScore?: number;
    timeLimit?: number;
  }) => api.post('/quizzes/doctor', data),
  addQuestion: (quizId: string, data: {
    text: string;
    type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
    points?: number;
    options: { text: string; isCorrect: boolean }[];
  }) => api.post(`/quizzes/doctor/${quizId}/question`, data),
  updateQuestion: (questionId: string, data: {
    text?: string;
    points?: number;
  }) => api.put(`/quizzes/doctor/question/${questionId}`, data),
  deleteQuestion: (questionId: string) =>
    api.delete(`/quizzes/doctor/question/${questionId}`),
};

// Enrollments API
export const enrollmentsApi = {
  // Student
  enroll: (courseId: string) => api.post(`/enrollments/student/${courseId}`),
  drop: (courseId: string) => api.delete(`/enrollments/student/${courseId}`),
  getMyEnrollments: () => api.get('/enrollments/student'),
  checkEnrollment: (courseId: string) =>
    api.get(`/enrollments/student/${courseId}/check`),
  
  // Doctor
  getCourseStudents: (courseId: string) =>
    api.get(`/enrollments/doctor/${courseId}/students`),
};

// Progress API
export const progressApi = {
  updateLessonProgress: (lessonId: string, data: { watchTime?: number; completed?: boolean }) =>
    api.put(`/progress/student/lesson/${lessonId}`, data),
  markLessonComplete: (lessonId: string) =>
    api.post(`/progress/student/lesson/${lessonId}/complete`),
  getLessonProgress: (lessonId: string) =>
    api.get(`/progress/student/lesson/${lessonId}`),
  getCourseProgress: (courseId: string) =>
    api.get(`/progress/student/course/${courseId}`),
  getDashboard: () => api.get('/progress/student/dashboard'),
};

export default api;
