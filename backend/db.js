// Use mock Prisma client due to firewall restrictions on binaries
const mockPrisma = require('./db-mock');

// Export the mock prisma client
module.exports = mockPrisma;