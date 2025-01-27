import { motion } from "framer-motion";

interface HistoryEntry {
  id: number;
  timestamp: Date;
  values: {
    w: number;
    x: number;
    y: number;
    z: number;
  };
}

interface HistoryProps {
  entries: HistoryEntry[];
}

export const History = ({ entries }: HistoryProps) => {
  if (entries.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto mt-8"
    >
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">History</h2>
        <div className="space-y-2">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50/80 rounded-xl"
            >
              <div className="flex items-center space-x-4">
                {Object.entries(entry.values).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <span className="text-xs font-medium text-gray-500 block">
                      {key.toUpperCase()}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <span className="text-xs text-gray-500">
                {new Date(entry.timestamp).toLocaleTimeString()}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};