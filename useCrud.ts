import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_APP_API;

const MAIN_API = axios.create({
  baseURL: API,
});

interface ResourceData {
  id?: string;
  title: string;
  body: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

const useCRUD = (key: string | string[], apiUrl: string) => {
  const navigate = useNavigate();
  const [enable, setEnable] = useState(false);
  const loginRequest = async (credentials: LoginCredentials) => {
    const response = await MAIN_API.post(`/${apiUrl}`, credentials);
    return response.data;
  };

  const fetchResource = async (token: any) => {
    try {
      if (!token) {
        localStorage.removeItem("name");
        navigate(import.meta.env.BASE_URL);
        setEnable(false);
        return null;
      }

      const response = await MAIN_API.get(`/${apiUrl}`, {
        headers: {
          token: token,
        },
      });

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 404) {
        navigate(import.meta.env.BASE_URL);
        setEnable(false);
        return null;
      }
      throw error;
    }
  };

  const createResource = async (newResource: ResourceData) => {
    const response = await MAIN_API.post(`/${apiUrl}`, newResource);
    return response.data;
  };

  const updateResource = async (updatedResource: ResourceData) => {
    const response = await MAIN_API.put(
      `/${apiUrl}/${updatedResource.id}`,
      updatedResource
    );
    return response.data;
  };

  const deleteResource = async (id: string) => {
    const response = await MAIN_API.delete(`/${apiUrl}/${id}`);
    return response.data;
  };

  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");
  const { data, isLoading, error, isError, isSuccess } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: [key],
    queryFn: () => fetchResource(token),
    enabled: enable,
  });

  //Mutations ...

  const loginMutation = useMutation<string, any, LoginCredentials>(
    loginRequest,
    {
      onError: (error) => {
        console.error("Login failed:", error.message);
      },
      onSuccess: (data) => {
        localStorage.setItem("token", data["token"]);
        localStorage.setItem("name", data["name"]);
        queryClient.invalidateQueries([key]);
      },
    }
  );

  const createMutation = useMutation(
    (newResource: ResourceData) => createResource(newResource),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([key]);
      },
    }
  );

  const updateMutation = useMutation(
    (updatedResource: ResourceData) => updateResource(updatedResource),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([key]);
      },
    }
  );

  const deleteMutation = useMutation((id: string) => deleteResource(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([key]);
    },
  });

  return {
    data,
    isLoading,
    error,
    isError,
    isSuccess,
    enable,
    setEnable,
    createResource: createMutation.mutate,
    updateResource: updateMutation.mutate,
    deleteResource: deleteMutation.mutate,
    login: loginMutation.mutate,
    isLoadingLogin: loginMutation.isLoading,
    loginError: loginMutation.error,
    loginSuccess: loginMutation.isSuccess,
  };
};

export default useCRUD;