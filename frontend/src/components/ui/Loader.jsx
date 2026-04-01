export default function Loader() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-14 bg-gray-200 rounded animate-pulse" />
      ))}
    </div>
  );
}