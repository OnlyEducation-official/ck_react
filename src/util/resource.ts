
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
  SubjectCategories: {
    routeName: "test-series-subject-categories",
    uid: "test-subject-categories",
    labels: {
      plural: "Subject Category",
      singular: "Subject categories",
    },
  },
  subjectChapter: {
    routeName: "test-series-chapters",
    uid: "test-series-chapters",
    labels: {
      plural: "Subject Chapter",
      singular: "Subject Chapters",
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

  if (pathname.includes("test-subject-category")) {
    return resources.SubjectCategories;
  }
  if(pathname.includes("test-chapter")){
    return resources.subjectChapter;
  }

  return null; // fallback
}
