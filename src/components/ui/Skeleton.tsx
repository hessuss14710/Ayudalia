export function PostSkeleton() {
  return (
    <div className="p-4 animate-pulse">
      <div className="flex gap-3">
        <div className="w-11 h-11 rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1">
          <div className="flex gap-2 items-center">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-12 bg-gray-100 rounded" />
          </div>
          <div className="flex gap-2 mt-2">
            <div className="h-5 w-28 bg-gray-200 rounded-full" />
            <div className="h-5 w-20 bg-gray-100 rounded-full" />
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-100 rounded" />
          </div>
          <div className="h-48 w-full bg-gray-100 rounded-xl mt-3" />
          <div className="flex gap-4 mt-3 pt-2 border-t border-gray-100">
            <div className="h-8 w-16 bg-gray-100 rounded-full" />
            <div className="h-8 w-16 bg-gray-100 rounded-full" />
            <div className="h-8 w-8 bg-gray-100 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function CampaignSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-20 bg-gray-200 rounded-full" />
        <div className="h-5 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-3 w-full bg-gray-100 rounded-full mt-4" />
        <div className="flex justify-between">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  )
}

export function ConversationSkeleton() {
  return (
    <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100 animate-pulse">
      <div className="w-13 h-13 rounded-full bg-gray-200" style={{ width: 52, height: 52 }} />
      <div className="flex-1">
        <div className="h-4 w-28 bg-gray-200 rounded" />
        <div className="h-3 w-40 bg-gray-100 rounded mt-1.5" />
      </div>
      <div className="h-3 w-8 bg-gray-100 rounded" />
    </div>
  )
}
