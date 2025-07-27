import { StudioProject } from "../types/studio";

export async function exportRBLX(project: StudioProject): Promise<void> {
  try {
    // Create a simplified RBLX-like structure
    const rblxData = {
      className: "DataModel",
      children: [
        {
          className: "Workspace",
          properties: {
            Name: "Workspace",
            Gravity: project.settings.workspace.gravity,
            FilteringEnabled: project.settings.workspace.filteringEnabled,
          },
          children: project.objects
            .filter(obj => obj.parent === 'workspace' || !obj.parent)
            .map(obj => convertObjectToRBLX(obj, project.objects))
        },
        {
          className: "Lighting",
          properties: {
            Name: "Lighting",
            Ambient: project.settings.lighting.ambient,
            Brightness: project.settings.lighting.brightness,
            OutdoorAmbient: project.settings.lighting.outdoor,
          }
        },
        {
          className: "StarterGui",
          properties: {
            Name: "StarterGui"
          }
        },
        {
          className: "StarterPack",
          properties: {
            Name: "StarterPack"
          }
        },
        {
          className: "StarterPlayer",
          properties: {
            Name: "StarterPlayer"
          }
        },
        {
          className: "ReplicatedStorage",
          properties: {
            Name: "ReplicatedStorage"
          }
        },
        {
          className: "ServerStorage",
          properties: {
            Name: "ServerStorage"
          }
        },
        {
          className: "Players",
          properties: {
            Name: "Players"
          }
        }
      ]
    };

    // Convert to XML format (simplified RBLX structure)
    const xml = objectToXML(rblxData);
    const blob = new Blob([xml], { type: 'application/xml' });
    
    // Use the modern File System Access API if available, fallback to download
    if ('showSaveFilePicker' in window) {
      try {
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: `${project.name.replace(/[^a-z0-9]/gi, '_')}.rbxl`,
          types: [{
            description: 'Roblox Place Files',
            accept: { 'application/xml': ['.rbxl'] }
          }]
        });
        
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        
        console.log('RBLX file exported to device successfully');
        return;
      } catch (err) {
        // User cancelled or API not supported, fall back to download
      }
    }
    
    // Fallback to download method
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/[^a-z0-9]/gi, '_')}.rbxl`;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('RBLX file exported to Downloads folder successfully');
  } catch (error) {
    console.error('Failed to export RBLX file:', error);
    throw error;
  }
}

function convertObjectToRBLX(obj: any, allObjects: any[]): any {
  const children = allObjects.filter(child => child.parent === obj.id);
  
  let className = 'Part';
  switch (obj.type) {
    case 'SpawnLocation':
      className = 'SpawnLocation';
      break;
    case 'Script':
      className = 'Script';
      break;
    case 'LocalScript':
      className = 'LocalScript';
      break;
    default:
      className = 'Part';
  }

  const rblxObject: any = {
    className,
    properties: {
      Name: obj.name,
      Position: `${obj.position.x}, ${obj.position.y}, ${obj.position.z}`,
      Rotation: `${obj.rotation.x * 180 / Math.PI}, ${obj.rotation.y * 180 / Math.PI}, ${obj.rotation.z * 180 / Math.PI}`,
      Size: `${obj.scale.x}, ${obj.scale.y}, ${obj.scale.z}`,
      BrickColor: obj.color,
      Material: obj.material,
      Shape: obj.shape,
      Anchored: obj.anchored,
      CanCollide: obj.canCollide,
      Transparency: obj.transparency,
      Visible: obj.visible,
      Locked: obj.locked,
    }
  };

  if (obj.script && (obj.type === 'Script' || obj.type === 'LocalScript')) {
    rblxObject.properties.Source = obj.script;
  }

  if (children.length > 0) {
    rblxObject.children = children.map(child => convertObjectToRBLX(child, allObjects));
  }

  return rblxObject;
}

function objectToXML(obj: any, indent = 0): string {
  const tabs = '  '.repeat(indent);
  let xml = '';

  if (obj.className) {
    xml += `${tabs}<Item class="${obj.className}">\n`;
    
    if (obj.properties) {
      xml += `${tabs}  <Properties>\n`;
      for (const [key, value] of Object.entries(obj.properties)) {
        xml += `${tabs}    <${key}>${escapeXML(String(value))}</${key}>\n`;
      }
      xml += `${tabs}  </Properties>\n`;
    }
    
    if (obj.children && obj.children.length > 0) {
      for (const child of obj.children) {
        xml += objectToXML(child, indent + 1);
      }
    }
    
    xml += `${tabs}</Item>\n`;
  }

  return xml;
}

function escapeXML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
