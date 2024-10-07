import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), '/src/data', 'number.json');

// Helper function to read numbers from the JSON file
async function readNumbers() {
    const fileContents = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContents);
}

// Helper function to write numbers to the JSON file
async function writeNumbers(numbers) {
    await fs.writeFile(dataFilePath, JSON.stringify(numbers, null, 2)); // Write back to JSON
}

// GET API - Retrieve all numbers
export async function GET(request) {
    try {
        const numbers = await readNumbers();
        return new Response(JSON.stringify(numbers), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response('Failed to retrieve numbers', { status: 500 });
    }
}

// POST API - Add a new number
export async function POST(request) {
    try {
        const { newNumber, newName } = await request.json();
        
        // Validate input
        if (newNumber === undefined || typeof newNumber !== 'string' || !newName || newName.trim() === '') {
            return new Response('Invalid input', { status: 400 });
        }

        // Ensure newNumber is exactly 10 digits
        if (newNumber.length !== 10 || isNaN(Number(newNumber))) {
            return new Response('Phone number must be a 10-digit string', { status: 400 });
        }

        const numbers = await readNumbers(); // Read existing numbers

        // Create new number object
        const newNumberObject = { id: Date.now(), name: newName, number: newNumber };
        numbers.push(newNumberObject); // Add to the array

        await writeNumbers(numbers); // Write updated array back to the JSON file

        return new Response('Number added successfully', { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response('Failed to add number', { status: 500 });
    }
}

// PUT API - Update an existing number
export async function PUT(request) {
    try {
        const { id, newNumber, newName } = await request.json(); // Expect id, newNumber, and newName

        // Validate input
        if (newNumber === undefined || typeof newNumber !== 'string' || !newName || newName.trim() === '') {
            return new Response('Invalid input', { status: 400 });
        }

        // Ensure newNumber is exactly 10 digits
        if (newNumber.length !== 10 || isNaN(Number(newNumber))) {
            return new Response('Phone number must be a 10-digit string', { status: 400 });
        }

        const numbers = await readNumbers(); // Read existing numbers

        // Find the index of the number to update
        const index = numbers.findIndex(num => num.id === id);
        if (index === -1) {
            return new Response('Number not found', { status: 404 });
        }

        // Update number
        numbers[index] = { ...numbers[index], name: newName, number: newNumber };

        await writeNumbers(numbers); // Write updated array back to the JSON file

        return new Response('Number updated successfully', { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response('Failed to update number', { status: 500 });
    }
}

// DELETE API - Delete a number
export async function DELETE(request) {
    try {
        const { id } = await request.json(); // Expect id

        const numbers = await readNumbers(); // Read existing numbers

        // Filter out the number to delete
        const updatedNumbers = numbers.filter(num => num.id !== id);

        await writeNumbers(updatedNumbers); // Write updated array back to the JSON file

        return new Response('Number deleted successfully', { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response('Failed to delete number', { status: 500 });
    }
}
