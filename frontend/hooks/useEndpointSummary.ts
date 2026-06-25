"use client";

import { useEffect, useState } from "react";
import { EndpointSummary } from "../types/endpoint-summary";
import { getEndpointSummaries } from "../services/endpoint-summary-api";

export function useEndpointSummary() {
  const [summaries, setSummaries] = useState<EndpointSummary[]>([]);

  useEffect(() => {
    async function loadSummaries() {
      try {
        const data = await getEndpointSummaries();
        setSummaries(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadSummaries();
  }, []);

  return summaries;
}
