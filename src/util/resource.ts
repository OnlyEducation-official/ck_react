export const resources = {
  exams: {
    routeName: "t-exams",
    uid: "test-exams",
    labels: {
      plural: "Exams",
      singular: "Exam",
    },
  },
  categories: {
    routeName: "t-categories",
    uid: "test-exams-category",
    labels: {
      plural: "Categories",
      singular: "Category",
    },
  },
  questions: {
    routeName: "t-questions",
    uid: "questions",
    labels: {
      plural: "Questions",
      singular: "Question",
    },
  },
  subjects: {
    routeName: "test-series-subjects",
    uid: "test-subject",
    labels: {
      plural: "Subjects",
      singular: "Subject",
    },
  },
  topics: {
    routeName: "t-topics",
    uid: "test-topic",
    labels: {
      plural: "Topics",
      singular: "Topic",
    },
  },
};

export function getResourceByPath(pathname: string) {
  if (pathname.includes("test-exams-category-list")) {
    return resources.categories;
  }

  if (pathname.includes("questions-list")) {
    return resources.questions;
  }

  if (pathname.includes("test-subject-list")) {
    return resources.subjects;
  }

  if (pathname.includes("test-topic-list")) {
    return resources.topics;
  }

  if (pathname.includes("exams-list")) {
    return resources.exams;
  }

  return null; // fallback
}
