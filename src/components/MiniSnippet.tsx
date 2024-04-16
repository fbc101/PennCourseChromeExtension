import React, { useState } from 'react';

export interface pennCourse {
  text: string;
}

export const MiniSnippetItem: React.FC<pennCourse> = ({ text }) => {
  return (
    <div>
        {text}
    </div>
  );
};
