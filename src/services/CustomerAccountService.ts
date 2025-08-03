import axios from "axios";
import type { CustomerAccountDto } from "../models/CustomerAccountDto";

const API_URL = "https://localhost:7029/api/CustomerAccount";

export const getAllCustomerAccounts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getCustomerAccountById = async (id: number) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createCustomerAccount = async (customer: CustomerAccountDto) => {
  const response = await axios.post(API_URL, customer);
  return response.data;
};

export const updateCustomerAccount = async (customer: CustomerAccountDto) => {
  const response = await axios.put(API_URL, customer);
  return response.data;
};

export const deleteCustomerAccount = async (id: number) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.status === 204;
};
