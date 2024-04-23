import React, { useState } from 'react';

export interface pennCourse {
  text: string;
}

export const MiniSnippetTitle1: React.FC<pennCourse> = ({ text }) => {
  return (
    <div className='title-one'>
        {text}
    </div>
  );
};

export const MiniSnippetTitle2: React.FC<pennCourse> = ({ text }) => {
  return (
    <div className='title-two'>
        {text}
    </div>
  );
};

export const MiniSnippetItem: React.FC<pennCourse> = ({ text }) => {
  return (
    <div className='mini-snippet'>
        {text}
    </div>
  );
};

export const MiniSnippetText: React.FC<pennCourse> = ({ text }) => {
  return (
    <div className='snippet-text'>
        {text}
    </div>
  );
};