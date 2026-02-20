"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationChannel = exports.EmailType = exports.UserRole = exports.CheckinStatus = exports.PaymentStatus = exports.BookingStatus = exports.prisma = void 0;
/**
 * Prisma Client Instance
 * Singleton pattern for database connections
 * Integrates with Supabase PostgreSQL
 *
 * Prisma v7 Pattern: Requires driver adapter
 * Single Source of Truth: All Prisma imports should come from this file
 */
require("dotenv/config");
var adapter_pg_1 = require("@prisma/adapter-pg");
var client_1 = require("./prisma.generated/client");
// Singleton pattern for Next.js (prevents multiple instances in dev mode)
var globalForPrisma = globalThis;
// Initialize driver adapter (required in Prisma v7)
var connectionString = "".concat(process.env.DATABASE_URL);
var adapter = new adapter_pg_1.PrismaPg({ connectionString: connectionString });
// Instantiate PrismaClient with adapter and logging
exports.prisma = (_a = globalForPrisma.prisma) !== null && _a !== void 0 ? _a : new client_1.PrismaClient({
    adapter: adapter,
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
});
// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = exports.prisma;
}
// ✨ SINGLE SOURCE OF TRUTH: Re-export all Prisma types, enums, and utilities
__exportStar(require("./prisma.generated/client"), exports);
var client_2 = require("./prisma.generated/client");
// Enums
Object.defineProperty(exports, "BookingStatus", { enumerable: true, get: function () { return client_2.BookingStatus; } });
Object.defineProperty(exports, "PaymentStatus", { enumerable: true, get: function () { return client_2.PaymentStatus; } });
Object.defineProperty(exports, "CheckinStatus", { enumerable: true, get: function () { return client_2.CheckinStatus; } });
Object.defineProperty(exports, "UserRole", { enumerable: true, get: function () { return client_2.UserRole; } });
Object.defineProperty(exports, "EmailType", { enumerable: true, get: function () { return client_2.EmailType; } });
Object.defineProperty(exports, "NotificationChannel", { enumerable: true, get: function () { return client_2.NotificationChannel; } });
exports.default = exports.prisma;
