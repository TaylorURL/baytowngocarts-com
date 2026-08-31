import { Skeleton, SkeletonRegion } from "./Skeleton.jsx";

/*
 * Holds a route's shape while its chunk arrives.
 *
 * Every page opens the same way - pulled up under the bar, on a dark hero
 * carrying a badge, a heading and a line of description - so the placeholder is
 * that opening, on the boxes the content lands on. The ground, the stripe and
 * the divider are the real ones, and the block beneath keeps the container
 * rhythm the routes share, so the swap moves nothing already on screen.
 */
const RouteFallback = () => (
  <SkeletonRegion label="Loading page" className="w-full -mt-20">
    <section className="relative bg-asphalt-900 overflow-hidden pt-32 pb-20 min-h-[50dvh] flex items-center">
      <div
        className="absolute inset-0 z-0 pointer-events-none asphalt-grain"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 left-0 right-0 h-1.5 z-[5] race-stripe"
        aria-hidden="true"
      />
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl text-center mx-auto">
          <Skeleton className="mx-auto mb-6 h-7 w-40 rounded-pill bg-asphalt-700" />
          <Skeleton className="mx-auto mb-5 h-4 w-56 bg-asphalt-700" />
          <Skeleton className="mx-auto mb-4 h-16 w-full max-w-2xl bg-asphalt-700" />
          <Skeleton className="mx-auto h-6 w-full max-w-xl bg-asphalt-700" />
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-16 z-[6] bg-chalk speedway-divider"
        aria-hidden="true"
      />
    </section>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-3xl mx-auto text-center">
        <Skeleton className="mx-auto mb-5 h-4 w-32" />
        <Skeleton className="mx-auto mb-4 h-12 w-full max-w-lg" />
        <Skeleton className="mx-auto h-6 w-full max-w-md" />
      </div>
    </div>
  </SkeletonRegion>
);

export default RouteFallback;
