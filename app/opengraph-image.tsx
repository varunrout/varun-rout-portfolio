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
        metricLabel="Contextual xG, benchmarked against its baseline"
        mineText="0.8131 CxG"
        benchText="vs logistic 0.7982"
      />
    ),
    { ...size },
  );
}
