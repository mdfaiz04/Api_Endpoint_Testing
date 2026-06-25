"use client";

import { useEffect, useState } from "react";
import { ApiEndpoint } from "../types/api-endpoint";
import { getEndpoints } from "../services/endpoints-api";

export function useEndpoints() {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);

  useEffect(() => {
    async function loadEndpoints() {
      try {
        const data = await getEndpoints();
        setEndpoints(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadEndpoints();
  }, []);

  return endpoints;
}