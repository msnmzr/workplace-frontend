import { PaymentsOverview } from "@/components/Charts/payments-overview";
import { UsedDevices } from "@/components/Charts/used-devices";
import { WeeksProfit } from "@/components/Charts/weeks-profit";
import { TopChannels } from "@/components/Tables/top-channels";
import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { Suspense } from "react";
import { ChatsCard } from "../_components/chats-card";
import { OverviewCardsGroup } from "../_components/overview-cards";
import { OverviewCardsSkeleton } from "../_components/overview-cards/skeleton";
import { RegionLabels } from "../_components/region-labels";
import { SSOAppsCard } from "../_components/sso-apps-card";
import { InfoWidget } from "../_components/info-widget";

import { NewsCard } from "../_components/news-card";
import { NewsCarousel } from "../_components/news-carousel";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default async function Home({ searchParams }: PropsType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);

  return (
    <>
      <div className="mb-4 grid grid-cols-1 gap-4 md:mb-6 md:gap-6 2xl:mb-9 2xl:gap-7.5">
        <NewsCarousel />
        <SSOAppsCard />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <NewsCard />
          <InfoWidget
            title="Recent Job Openings"
            items={[
              { title: "Senior Frontend Developer", date: "Posted 2 days ago", meta: "Engineering" },
              { title: "Product Marketing Manager", date: "Posted 5 days ago", meta: "Marketing" },
              { title: "UX Designer", date: "Posted 1 week ago", meta: "Design" },
            ]}
          />
          <InfoWidget
            title="Recent Circulars"
            items={[
              { title: "Holiday Schedule 2026", date: "Jan 01, 2026", meta: "PDF" },
              { title: "Updated Remote Work Policy", date: "Dec 15, 2025", meta: "DOCX" },
              { title: "IT Security Guidelines", date: "Dec 10, 2025", meta: "PDF" },
            ]}
          />
        </div>
      </div>

      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup />
      </Suspense>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <PaymentsOverview
          className="col-span-12 xl:col-span-7"
          key={extractTimeFrame("payments_overview")}
          timeFrame={extractTimeFrame("payments_overview")?.split(":")[1]}
        />

        <WeeksProfit
          key={extractTimeFrame("weeks_profit")}
          timeFrame={extractTimeFrame("weeks_profit")?.split(":")[1]}
          className="col-span-12 xl:col-span-5"
        />

        <UsedDevices
          className="col-span-12 xl:col-span-5"
          key={extractTimeFrame("used_devices")}
          timeFrame={extractTimeFrame("used_devices")?.split(":")[1]}
        />

        <RegionLabels />

        <div className="col-span-12 grid xl:col-span-8">
          <Suspense fallback={<TopChannelsSkeleton />}>
            <TopChannels />
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <ChatsCard />
        </Suspense>
      </div>
    </>
  );
}
