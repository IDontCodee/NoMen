import React from "react";
import Obfuscate from "../../components/obfuscate.jsx";
import { manualSave, restore } from '../../fileStore.js';
import { resetSettings, resetAll } from "../../settings.js";

function BackupButton({ type, children }) {
  return (
    <div
    onClick={() => {
      if(type == "save") return manualSave();
      if(type == "load") return restore();
    }}
    className="optionchoose"
    >
      {children}
    </div>
  );
}

function App() {
  return (
    <>
      <div className="optiontitle">
        <Obfuscate>Backups</Obfuscate>
      </div>
      <div className="chooseoption">
        <BackupButton type="load">Load from File</BackupButton>
        <BackupButton type="save">Manually save to file</BackupButton>
      </div>
      <div className="optiontitle">
        <Obfuscate>Reset</Obfuscate>
      </div>
      <div className="chooseoption">
        <div
          onClick={() => {
            if(window.confirm('Are you sure you want to reset all settings?')) resetSettings();
          }}
          className="optionchoose">Settings
        </div>
        <div
          onClick={() => {
            if(window.confirm('Are you sure you want to reset EVERTHING? THIS CANNOT BE UNDONE!!!\n\n\n(includes all your saves as well)\n\n\n(...i guess if you saved a backup it could be undone)')) {
              if(window.confirm('Are you REALLY sure you want to do this? THIS CANNOT BE UNDONE!!!')) resetAll();
            }
          }}
          className="optionchoose">Everything
        </div>
      </div>
    </>
  );
}

export default App;