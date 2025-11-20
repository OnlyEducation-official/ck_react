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

type InitDataContextType = {
  subjectTagData: genericFetchData[];
  topicTagData: genericFetchData[];
  examCategoryData: genericFetchData[];
  tExamsData: genericFetchData[];
};

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

const InitialDataContext = createContext({} as InitDataContextType);

export function InitialDataContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [data, setData] = useState({} as InitDataContextType);
  useEffect(() => {
    async function dummy() {
      const subjectData = await fetchDataFunc(
        `${import.meta.env.VITE_BASE_URL}test-series-subjects?[fields][0]=name&[fields][1]=slug`
      );
      const topicData = await fetchDataFunc(
        `${import.meta.env.VITE_BASE_URL}t-topics?[fields][0]=name&[fields][1]=slug`
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
  }, []);
  return (
    <InitialDataContext.Provider value={data}>
      {children}
    </InitialDataContext.Provider>
  );
}

const useInitialDataContext = () => useContext(InitialDataContext);
export default useInitialDataContext;
