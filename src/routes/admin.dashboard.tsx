{mediaType === "video" && (
  <div className="sm:col-span-2 space-y-3 rounded-lg border border-border bg-background p-4">
    <h4 className="text-sm font-semibold">Video Information</h4>
    <div>
      <label className="block text-xs font-semibold uppercase text-muted-foreground">
        YouTube Video Link (Recommended)
      </label>
      <input 
        name="video_url" 
        placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..." 
        className={inputClass} 
      />
      <p className="mt-1 text-[11px] text-muted-foreground">
        Paste any video link from your YouTube channel. It will automatically load the thumbnail and stream smoothly!
      </p>
    </div>
    <div>
      <label className="block text-xs font-semibold uppercase text-muted-foreground">
        OR Upload Small MP4 Video (Max 8MB)
      </label>
      <input type="file" name="video_file" accept="video/mp4,video/webm" className="mt-1 block w-full text-xs" />
    </div>
  </div>
)}
