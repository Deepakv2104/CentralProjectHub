import React from 'react';
import ProjectData from './projectList';
import { firestore } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';

const JsonUploadToFirebase = () => {
  const uploadDataToFirebase = async () => {
    try {
      const db = firestore;

      if (!ProjectData) {
        console.error('No JSON data available.');
        return;
      }

      // Upload each project as a new document to the "projects" collection
      for (const project of ProjectData) {
        await addDoc(collection(db, 'projects'), project);
        console.log('Document successfully written!');
      }

      console.log('All documents uploaded successfully!');
    } catch (error) {
      console.error('Error writing documents: ', error);
    }
  };

  return (
    <div>
      <button onClick={uploadDataToFirebase}>Upload to Firebase</button>
    </div>
  );
};

export default JsonUploadToFirebase;
