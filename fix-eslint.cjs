const fs = require('fs');
const path = require('path');

const filesToFix = [
  {
    path: 'src/App.jsx',
    fixes: [
      { search: "import React, { useState } from 'react';", replace: "import { useState } from 'react';" }
    ]
  },
  {
    path: 'src/context/AppContext.jsx',
    fixes: [
      { search: "import React, { createContext,", replace: "import { createContext," },
      { search: "export const useAppContext", replace: "// eslint-disable-next-line react-refresh/only-export-components\nexport const useAppContext" }
    ]
  },
  {
    path: 'src/pages/Plan.jsx',
    fixes: [
      { search: "import React, { useState } from 'react';", replace: "import { useState } from 'react';" },
      { search: "} catch (error) {", replace: "} catch {" },
      { search: "mealPlan.days.forEach((day, index) => {", replace: "mealPlan.days.forEach((day) => {" }
    ]
  },
  {
    path: 'src/pages/Scan.jsx',
    fixes: [
      { search: "import React, { useState, useRef } from 'react';", replace: "import { useState, useRef } from 'react';" },
      { search: "} catch (error) {", replace: "} catch {" }
    ]
  },
  {
    path: 'src/pages/Today.jsx',
    fixes: [
      { search: "import React, { useMemo } from 'react';", replace: "import { useMemo } from 'react';" },
      { search: "import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';", replace: "import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';" }
    ]
  },
  {
    path: 'src/pages/Streaks.jsx',
    fixes: [
      { search: "import React from 'react';\n", replace: "" }
    ]
  },
  {
    path: 'src/pages/Onboarding.jsx',
    fixes: [
      { search: "import React, { useState } from 'react';", replace: "import { useState } from 'react';" }
    ]
  }
];

filesToFix.forEach(f => {
  const fullPath = path.join(__dirname, f.path);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    f.fixes.forEach(fix => {
      content = content.replace(fix.search, fix.replace);
    });
    fs.writeFileSync(fullPath, content);
    console.log('Fixed ' + f.path);
  }
});
