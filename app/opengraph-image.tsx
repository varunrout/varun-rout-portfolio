import { ImageResponse } from 'next/og';
import { OgCard, OG_SIZE } from '@/lib/og-card';

export const alt = 'Varun Rout — Applied Data Science';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        kicker="Applied data science · Birmingham, UK"
        title="Forecasting, causal ML, and models that earn their claims."
        metricLabel="Contextual xG, benchmarked against the incumbent"
        mineText="0.809 CxG"
        benchText="vs StatsBomb 0.820"
      />
    ),
    { ...size },
  );
}
