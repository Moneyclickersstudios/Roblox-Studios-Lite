import { useObjects } from "../../lib/stores/useObjects";
import { useStudio } from "../../lib/stores/useStudio";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Separator } from "../ui/separator";

export function Properties() {
  const { selectedObjectId } = useStudio();
  const { getObject, updateObject } = useObjects();
  
  const selectedObject = selectedObjectId ? getObject(selectedObjectId) : null;

  if (!selectedObject) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-3 border-b border-gray-700">
          <h3 className="text-sm font-medium text-white">Properties</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
          No object selected
        </div>
      </div>
    );
  }

  const updateProperty = (property: string, value: any) => {
    updateObject(selectedObject.id, { [property]: value });
  };

  const updatePosition = (axis: 'x' | 'y' | 'z', value: number) => {
    const newPosition = selectedObject.position.clone();
    newPosition[axis] = value;
    updateObject(selectedObject.id, { position: newPosition });
  };

  const updateRotation = (axis: 'x' | 'y' | 'z', value: number) => {
    const newRotation = selectedObject.rotation.clone();
    newRotation[axis] = (value * Math.PI) / 180; // Convert degrees to radians
    updateObject(selectedObject.id, { rotation: newRotation });
  };

  const updateScale = (axis: 'x' | 'y' | 'z', value: number) => {
    const newScale = selectedObject.scale.clone();
    newScale[axis] = value;
    updateObject(selectedObject.id, { scale: newScale });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-700">
        <h3 className="text-sm font-medium text-white">Properties</h3>
        <p className="text-xs text-gray-400">{selectedObject.name}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Basic Properties */}
        <div className="space-y-2">
          <Label className="text-xs text-gray-300">Name</Label>
          <Input
            value={selectedObject.name}
            onChange={(e) => updateProperty('name', e.target.value)}
            className="h-8 bg-gray-700 border-gray-600 text-white text-sm"
          />
        </div>

        {/* Appearance */}
        {selectedObject.type === 'Part' && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-gray-300">Appearance</h4>
              
              <div className="space-y-2">
                <Label className="text-xs text-gray-300">Shape</Label>
                <Select
                  value={selectedObject.shape}
                  onValueChange={(value) => updateProperty('shape', value)}
                >
                  <SelectTrigger className="h-8 bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Block">Block</SelectItem>
                    <SelectItem value="Ball">Ball</SelectItem>
                    <SelectItem value="Cylinder">Cylinder</SelectItem>
                    <SelectItem value="Wedge">Wedge</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-300">Color</Label>
                <input
                  type="color"
                  value={selectedObject.color}
                  onChange={(e) => updateProperty('color', e.target.value)}
                  className="w-full h-8 bg-gray-700 border border-gray-600 rounded cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-300">Material</Label>
                <Select
                  value={selectedObject.material}
                  onValueChange={(value) => updateProperty('material', value)}
                >
                  <SelectTrigger className="h-8 bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Plastic">Plastic</SelectItem>
                    <SelectItem value="Metal">Metal</SelectItem>
                    <SelectItem value="Wood">Wood</SelectItem>
                    <SelectItem value="Neon">Neon</SelectItem>
                    <SelectItem value="Glass">Glass</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-300">Transparency</Label>
                <Slider
                  value={[selectedObject.transparency]}
                  onValueChange={([value]) => updateProperty('transparency', value)}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{selectedObject.transparency.toFixed(1)}</span>
              </div>
            </div>
          </>
        )}

        {/* Transform */}
        <Separator />
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-gray-300">Transform</h4>
          
          {/* Position */}
          <div className="space-y-2">
            <Label className="text-xs text-gray-300">Position</Label>
            <div className="grid grid-cols-3 gap-1">
              {(['x', 'y', 'z'] as const).map((axis) => (
                <div key={axis} className="space-y-1">
                  <Label className="text-xs text-gray-400 uppercase">{axis}</Label>
                  <Input
                    type="number"
                    value={selectedObject.position[axis].toFixed(2)}
                    onChange={(e) => updatePosition(axis, parseFloat(e.target.value) || 0)}
                    className="h-7 bg-gray-700 border-gray-600 text-white text-xs"
                    step="0.1"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Rotation */}
          <div className="space-y-2">
            <Label className="text-xs text-gray-300">Rotation (degrees)</Label>
            <div className="grid grid-cols-3 gap-1">
              {(['x', 'y', 'z'] as const).map((axis) => (
                <div key={axis} className="space-y-1">
                  <Label className="text-xs text-gray-400 uppercase">{axis}</Label>
                  <Input
                    type="number"
                    value={((selectedObject.rotation[axis] * 180) / Math.PI).toFixed(1)}
                    onChange={(e) => updateRotation(axis, parseFloat(e.target.value) || 0)}
                    className="h-7 bg-gray-700 border-gray-600 text-white text-xs"
                    step="1"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Scale */}
          <div className="space-y-2">
            <Label className="text-xs text-gray-300">Size</Label>
            <div className="grid grid-cols-3 gap-1">
              {(['x', 'y', 'z'] as const).map((axis) => (
                <div key={axis} className="space-y-1">
                  <Label className="text-xs text-gray-400 uppercase">{axis}</Label>
                  <Input
                    type="number"
                    value={selectedObject.scale[axis].toFixed(2)}
                    onChange={(e) => updateScale(axis, parseFloat(e.target.value) || 0.1)}
                    className="h-7 bg-gray-700 border-gray-600 text-white text-xs"
                    step="0.1"
                    min="0.1"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Physics */}
        <Separator />
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-gray-300">Physics</h4>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anchored"
              checked={selectedObject.anchored}
              onCheckedChange={(checked) => updateProperty('anchored', checked)}
            />
            <Label htmlFor="anchored" className="text-xs text-gray-300">Anchored</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="canCollide"
              checked={selectedObject.canCollide}
              onCheckedChange={(checked) => updateProperty('canCollide', checked)}
            />
            <Label htmlFor="canCollide" className="text-xs text-gray-300">CanCollide</Label>
          </div>
        </div>

        {/* Visibility */}
        <Separator />
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="visible"
              checked={selectedObject.visible}
              onCheckedChange={(checked) => updateProperty('visible', checked)}
            />
            <Label htmlFor="visible" className="text-xs text-gray-300">Visible</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="locked"
              checked={selectedObject.locked}
              onCheckedChange={(checked) => updateProperty('locked', checked)}
            />
            <Label htmlFor="locked" className="text-xs text-gray-300">Locked</Label>
          </div>
        </div>
      </div>
    </div>
  );
}
