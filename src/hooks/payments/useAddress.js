import { useQuery } from "@tanstack/react-query";
import userApi from "../../lib/api/userAxios";


// 주소 배열 반환
const getMyAddressesAPI = async () => {
  const response = await userApi.get("/users/me/addresses/");
  return response.data
};

export const useGetMyAddresses = () => {
  return useQuery({
    queryKey: ["myAddresses"],
    queryFn: getMyAddressesAPI,
  });
};
