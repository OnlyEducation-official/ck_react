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
        "Bearer 2e50f97e2dbab2098ac3c8302155beef954e0f72bd1253a0336f633e65229bbe80ed0cf2feb91092cfa30d23345b1e1b77fd4f506fa8cbd4277e65f7a99b0f6e5fe477efa9cdf2b26239ebdc800346b2bfe20d5ec36f897a9a868b12270a86b6781c8b062f3a9c15f0306285694cd9019e3d42d48de2c3c0b6d3b1fff76647ba",
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
        "https://admin.onlyeducation.co.in/api/test-series-subjects?[fields][0]=name&[fields][1]=slug"
      );
      const topicData = await fetchDataFunc(
        "https://admin.onlyeducation.co.in/api/t-topics?[fields][0]=name&[fields][1]=slug"
      );
      const examCategoryData = await fetchDataFunc(
        "https://admin.onlyeducation.co.in/api/t-categories?[fields][0]=name&[fields][1]=slug"
      );
      const tExamsData = await fetchDataFunc(
        "https://admin.onlyeducation.co.in/api/t-exams?[fields][0]=title&[fields][1]=slug"
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
