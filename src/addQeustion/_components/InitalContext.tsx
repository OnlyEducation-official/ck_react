import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type genericFetchData = {
  id: number;
  attributes: {
    name: string;
    slug: string;
    title?: string;
  };
};

type InitDataState = {
  subjectTagData: genericFetchData[];
  topicTagData: genericFetchData[];
  examCategoryData: genericFetchData[];
  tExamsData: genericFetchData[];
};



type InitDataContextType = {
  data: InitDataState;
  setSubject: React.Dispatch<React.SetStateAction<number>>;
};

const InitialDataContext = createContext<InitDataContextType | null>(null);


// type InitDataContextType = {
//   subjectTagData: genericFetchData[];
//   topicTagData: genericFetchData[];
//   examCategoryData: genericFetchData[];
//   tExamsData: genericFetchData[];
// };

const fetchDataFunc = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization:
        `Bearer ${import.meta.env.VITE_STRAPI_BEARER}`,
    },
  });
  const data = await response.json();
  return data;
};



export function InitialDataContextProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [data, setData] = useState<InitDataState>({
    subjectTagData: [],
    topicTagData: [],
    examCategoryData: [],
    tExamsData: [],
  });

  const [subject, setSubject] = useState<number>(0);

  useEffect(() => {
    async function dummy() {
      console.log(subject)
      const subjectData = await fetchDataFunc(
        `${import.meta.env.VITE_BASE_URL}test-series-subjects?[fields][0]=name&[fields][1]=slug`
      );
      const topicData = await fetchDataFunc(
        `${import.meta.env.VITE_BASE_URL}t-topics?[fields][0]=name&[fields][1]=slug&filters[test_series_subject][id][$eq]=${subject}&populate[test_series_subject]=true&pagination[page]=1&pagination[pageSize]=1000`
      );
      const examCategoryData = await fetchDataFunc(
        `${import.meta.env.VITE_BASE_URL}t-categories?populate=*`
      );
      const tExamsData = await fetchDataFunc(
        `${import.meta.env.VITE_BASE_URL}t-exams?[fields][0]=title&[fields][1]=slug`
      );

      setData({
        subjectTagData: subjectData.data,
        topicTagData: topicData.data,
        examCategoryData: examCategoryData.data,
        tExamsData: tExamsData.data,
      });
    }
    dummy();
  }, [subject]);

  return (
    <InitialDataContext.Provider value={{ data, setSubject }}>
      {children}
    </InitialDataContext.Provider>
  );
}

const useInitialDataContext = () => {
  const ctx = useContext(InitialDataContext);
  if (!ctx) {
    throw new Error("useInitialDataContext must be used within InitialDataContextProvider");
  }
  return ctx;
};
export default useInitialDataContext;
