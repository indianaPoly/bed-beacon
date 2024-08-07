import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import imageLoader from '../util/imageLoader';
import chatbotIcon from '../assets/chatbot/chatbot.png';
import Chatbot from '../components/chatbot/Chatbot';
import useGetHospitalsAround from '../hooks/useGetHospitalsAround';
import Loading from './common/Loading';
import List from '../components/List/List';
import Layout from '../components/Layout/Layout';
import ErrorPage from './common/ErrorPage';
import PageViewTrigger from '../util/gtag';

const Result = () => {
  const [showChatbot, setShowChatbot] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = '주변 병원 페이지';
    PageViewTrigger();
  }, []);

  useEffect(() => {
    if (
      sessionStorage.getItem('longitude') === null &&
      sessionStorage.getItem('latitude') === null
    ) {
      navigate('/select');
    }
  }, [navigate]);

  const { data, isLoading, isError } = useGetHospitalsAround(
    sessionStorage.getItem('latitude') as string,
    sessionStorage.getItem('longitude') as string
  );

  const onClickChatbot = () => {
    setShowChatbot((prevState) => !prevState);
  };

  const location = `${sessionStorage.getItem('city')} ${sessionStorage.getItem(
    'district'
  )}`;

  return (
    <Layout>
      <div className="desktop:w-[900px] gap-[15px] flex flex-col relative">
        <button
          className="fixed bottom-4 right-4 w-12 h-12 flex justify-center items-center rounded-full cursor-pointer"
          onClick={onClickChatbot}
          type="button"
        >
          <img
            src={chatbotIcon}
            alt="Chatbot Icon"
            className="w-full h-full icon-click-animation"
          />
        </button>

        {showChatbot && (
          <div className="fixed bottom-20 right-4 bg-white w-64 h-15 border border-gray-300 rounded-md shadow-md p-4">
            <Chatbot />
          </div>
        )}
      </div>
      <div className="desktop:w-[900px] gap-[15px] flex flex-col items-center">
        <div className=" w-full flex justify-center items-center gap-[3px]">
          {data && (
            <>
              <span className="text-[12px] font-bold text-yellow-500">
                {sessionStorage.getItem('district2') !== ''
                  ? data.getLocation
                  : location}
              </span>
              <span className="text-[12px] font-normal text-gray-500">
                주변의 대학병원을 알려드릴게요.
              </span>
            </>
          )}
        </div>
        {isLoading && <Loading />}
        {isError && <ErrorPage />}
        {data && (
          <div className="grid place-items-center mobile:flex mobile:flex-col deskTop:grid deskTop:grid-cols-2 justify-center items-center gap-[20px]">
            {data.hospitalAruondResponse.data.result.hospitalList.map(
              (item) => (
                <Link to={`/result/${item.hpid}`} key={item.hpid}>
                  <List
                    key={item.hpid}
                    name={item.dutyName}
                    emergencyGeneralWard={item.hvec > 0 ? item.hvec : 0}
                    generalWard={item.hvgc}
                    distance={item.distance}
                    location={item.dutyAddr}
                    callNumber={item.dutyTel1}
                    hospitalCode={item.hpid}
                    image={imageLoader(item.hpid)}
                  />
                </Link>
              )
            )}
          </div>
        )}
        {data &&
          data.hospitalAruondResponse.data.result.totalElements === 0 && (
            <span className=" w-fit text-center text-[14px] font-bold text-red-400">
              주변에 대학병원이 없어요. <br />
              추후 업데이트가 될거에요.
            </span>
          )}
      </div>
    </Layout>
  );
};

export default Result;
