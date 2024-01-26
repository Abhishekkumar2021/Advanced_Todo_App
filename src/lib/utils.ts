import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

class API{
  baseUrl: string
  constructor(baseUrl: string){
    this.baseUrl = baseUrl
  }
  async get(path: string){
    const response = await fetch(this.baseUrl + path)
    return response.json()
  }
  async post(path: string, body: any){
    const response = await fetch(this.baseUrl + path, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      }
    })
    return response.json()
  }

  async delete(path: string){
    const response = await fetch(this.baseUrl + path, {
      method: "DELETE"
    })
    return response.json()
  }

  async put(path: string, body: any){
    const response = await fetch(this.baseUrl + path, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      }
    })
    return response.json()
  }

  async patch(path: string, body: any){
    const response = await fetch(this.baseUrl + path, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      }
    })
    return response.json()
  }
};

export const api = new API("http://localhost:8080/api/v1")
