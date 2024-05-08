import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import districtsByCity from '../data/districtsByCity';

const SelectionLocation = () => {
  const [city, setCity] = useState<string>();
  const [district, setDistrict] = useState<string>();

  const navigate = useNavigate();

  useEffect(() => {
    if (
      sessionStorage.getItem('latitude') !== null &&
      sessionStorage.getItem('longitude') !== null
    ) {
      navigate('/result');
    }
  });

  return (
    <div className="container mx-auto mt-8">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (city !== undefined && district !== undefined) {
            // eslint-disable-next-line array-callback-return
            districtsByCity[0].seoul.map((item) => {
              if (item.cityName === district) {
                sessionStorage.setItem('latitude', String(item.latitude));
                sessionStorage.setItem('longitude', String(item.longitude));
              }
            });
            navigate('/result');
          }
        }}
        className="max-x-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <select
            id="city"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-done focus:shadow-outline"
            value={city}
            onChange={(event) => {
              event.preventDefault();
              const selectCity = event.target.value;
              setCity(selectCity);
              sessionStorage.setItem('city', selectCity);
            }}
          >
            <option value="">시를 선택하세요</option>
            <option value="서울특별시">서울특별시</option>
          </select>
        </div>

        {/* city가 선택이 안된 경우에 클릭이 안되도록 설정함. */}
        <div className="mb-6">
          <select
            id="district"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-done focus:shadow-outline"
            value={district}
            onChange={(event) => {
              event.preventDefault();
              const selectDistrict = event.target.value;
              setDistrict(selectDistrict);
              sessionStorage.setItem('district', selectDistrict);
            }}
          >
            <option value="">구/시를 선택하세요</option>
            {city &&
              districtsByCity[0].seoul.map((item) => (
                <option key={item.cityName} value={item.cityName}>
                  {item.cityName}
                </option>
              ))}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            저장
          </button>
        </div>
      </form>
    </div>
  );
};

export default SelectionLocation;