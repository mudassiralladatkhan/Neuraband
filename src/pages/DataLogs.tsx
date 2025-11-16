import React from 'react';
import { Card } from '../components/ui/Card';
import { useNeuraBand } from '../contexts/NeuraBandContext';
import { Folder, File, Download } from 'lucide-react';

const DataLogs: React.FC = () => {
  const { data, connectionStatus } = useNeuraBand();
  const logs = data?.logs;

  if (connectionStatus === 'connecting') {
    return <div className="flex items-center justify-center h-full text-muted-foreground">Connecting to NeuraBand...</div>;
  }

  if (!logs) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">Waiting for data logs...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-muted">
            <thead className="bg-muted/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Size</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date Modified</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Download</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-muted">
              {logs.map((file) => (
                <tr key={file.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    <div className="flex items-center">
                      {file.type === 'folder' ? <Folder className="h-5 w-5 text-primary mr-3" /> : <File className="h-5 w-5 text-muted-foreground mr-3" />}
                      <span>{file.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{file.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{file.modified}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {file.type === 'file' && (
                      <button className="text-primary hover:text-primary/80 flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default DataLogs;
