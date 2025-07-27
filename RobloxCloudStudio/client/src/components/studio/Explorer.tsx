import { useState } from "react";
import { useObjects } from "../../lib/stores/useObjects";
import { useStudio } from "../../lib/stores/useStudio";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

export function Explorer() {
  const { objects, removeObject, updateObject, duplicateObject } = useObjects();
  const { selectedObjectId, setSelectedObject } = useStudio();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['workspace']));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNodes(newExpanded);
  };

  const startRename = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const finishRename = () => {
    if (editingId && editingName.trim()) {
      updateObject(editingId, { name: editingName.trim() });
    }
    setEditingId(null);
    setEditingName('');
  };

  const getObjectIcon = (obj: any) => {
    switch (obj.type) {
      case 'SpawnLocation': return '🏠';
      case 'Script': return '📜';
      case 'LocalScript': return '📄';
      case 'Camera': return '📷';
      case 'Light': return '💡';
      default:
        switch (obj.shape) {
          case 'Ball': return '⚽';
          case 'Cylinder': return '🔧';
          default: return '📦';
        }
    }
  };

  const renderObjectNode = (obj: any, depth = 0) => {
    const children = objects.filter(child => child.parent === obj.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedNodes.has(obj.id);
    const isSelected = selectedObjectId === obj.id;
    const isEditing = editingId === obj.id;

    return (
      <div key={obj.id}>
        <div 
          className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-700 ${
            isSelected ? 'bg-blue-600' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => setSelectedObject(obj.id)}
          onDoubleClick={() => startRename(obj.id, obj.name)}
        >
          {hasChildren && (
            <button
              className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-white mr-1"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(obj.id);
              }}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          {!hasChildren && <div className="w-5" />}
          
          <span className="mr-2">{getObjectIcon(obj)}</span>
          
          {isEditing ? (
            <Input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={finishRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') finishRename();
                if (e.key === 'Escape') {
                  setEditingId(null);
                  setEditingName('');
                }
              }}
              className="h-6 text-sm bg-gray-700 border-gray-600"
              autoFocus
            />
          ) : (
            <span 
              className={`text-sm flex-1 ${obj.visible ? 'text-white' : 'text-gray-500'}`}
            >
              {obj.name}
            </span>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {children.map(child => renderObjectNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootObjects = objects.filter(obj => !obj.parent);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-700">
        <h3 className="text-sm font-medium text-white">Explorer</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {rootObjects.map(obj => renderObjectNode(obj))}
      </div>
      
      {selectedObjectId && selectedObjectId !== 'workspace' && (
        <>
          <Separator />
          <div className="p-2 space-y-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => selectedObjectId && duplicateObject(selectedObjectId)}
            >
              📋 Duplicate
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => selectedObjectId && removeObject(selectedObjectId)}
            >
              🗑️ Delete
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
