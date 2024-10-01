import { promises as fs } from 'fs';
import path from 'path';

// Path to the data file
const dataFilePath = path.join(process.cwd(), '/src/data', 'data.js');

// Read and update places in the data file
export async function POST(request) {
  try {
    const { newPlace } = await request.json(); // Parse new place from request body

    if (!newPlace || newPlace.trim() === '') {
      return new Response('Invalid place', { status: 400 });
    }

    // Read current places from the file
    const data = await fs.readFile(dataFilePath, 'utf8');
    const fileContent = data.toString();

    // Find where the places array is defined in the file
    const regex = /export const places = (\[.*?\]);/s;
    const match = fileContent.match(regex);
    
    if (!match) {
      return new Response('Places array not found', { status: 500 });
    }

    const placesArray = JSON.parse(match[1]); // Parse the existing places array
    placesArray.push(newPlace); // Add the new place

    // Update the data file with the new places array
    const updatedFileContent = fileContent.replace(regex, `export const places = ${JSON.stringify(placesArray)};`);
    await fs.writeFile(dataFilePath, updatedFileContent, 'utf8'); // Save the updated file

    return new Response(JSON.stringify({ success: true, places: placesArray }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response('Failed to add place', { status: 500 });
  }
}
