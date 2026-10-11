export function Phone() {
  return (
    <div className="phone-float relative mx-auto h-[468px] w-[216px] overflow-hidden lg:h-[650px] lg:w-[300px] lg:overflow-visible">
      <div className="absolute top-0 left-0 w-[300px] origin-top-left scale-[0.72] lg:scale-100">
        <div className="relative aspect-[9/19.5] w-[300px] rounded-[2.7rem] border-4 border-[#343142] bg-[#0E0D14] p-2.5 shadow-[0_30px_60px_-12px_rgba(30,27,58,0.35)]">
        <div className="absolute left-1/2 top-4 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
        <div className="flex h-full flex-col overflow-hidden rounded-[2.1rem] bg-[#faf7f2] text-ink">
          <div className="flex items-center justify-between px-5 pt-7 text-[11px] font-semibold">
            <span>6:42</span>
            <span>5G</span>
          </div>
          <div className="flex items-start justify-between border-b border-line px-4 py-3">
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-plum uppercase">
                SetuHome · Today
              </p>
              <p className="font-serif text-sm">Kartika Amavasya</p>
            </div>
            <span className="rounded-full border border-line bg-white px-2 py-1 text-[10px] text-plum">
              Edison, NJ
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-3 px-4 py-4">
            <div className="relative h-28 overflow-hidden rounded-xl">
              <img src="/dawn.jpg" alt="" className="h-full w-full object-cover" />
              <p className="absolute bottom-2 left-2 text-[11px] text-white">Chapter 2, Verse 47</p>
            </div>
            <div className="rounded-2xl border border-line bg-white px-3 py-3 text-center">
              <p className="font-devanagari text-[15px] leading-7">
                कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।
                <br />
                मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥
              </p>
              <p className="mt-2 font-serif text-[12px] text-plum italic">
                karmaṇy-evādhikāras te mā phaleṣu kadācana
              </p>
            </div>
            <p className="px-1 text-[10px] font-semibold tracking-wide text-ink">
              In everyday words
            </p>
            <p className="px-1 text-center font-serif text-[13px] leading-snug">
              You have the right to do your work, but not to choose its results.
            </p>
            <div className="mt-auto flex items-center justify-between rounded-full border border-line bg-white px-3 py-2">
              <span className="text-[11px]">Sanskrit chant</span>
              <span className="rounded-full bg-marigold px-3 py-1 text-[11px] font-semibold">Listen</span>
            </div>
            <div className="flex items-center justify-between px-1 text-[10px] text-plum">
              <span>Sunrise for your city</span>
              <span className="text-ink">Morning streak</span>
            </div>
          </div>
          <div className="flex justify-center pb-3">
            <div className="h-1 w-24 rounded-full bg-ink/20" />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
