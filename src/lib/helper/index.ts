import { v4 as uuidv4 } from 'uuid';

class HelperFunctions {
    static generateUID(): string {
        return uuidv4(); // Generates a unique UUID
    }
}

export { HelperFunctions };
