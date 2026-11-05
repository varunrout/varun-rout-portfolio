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
        metricLabel="Possession danger, next to the baseline it has to beat"
        mineText="0.665 AUC"
        benchText="vs ball x/y 0.642"
      />
    ),
    { ...size },
  );
}
