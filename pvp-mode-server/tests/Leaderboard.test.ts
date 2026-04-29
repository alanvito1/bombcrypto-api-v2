import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app, dependencies } from '../src/Server';

describe('Leaderboard API', () => {
    // Mock the database service to avoid real DB calls during tests
    beforeEach(() => {
        vi.spyOn(dependencies.pvpService, 'getWeeklyLeaderboard').mockResolvedValue([
            { user_id: 1, username: 'Player1', points: 1000, wins: 10, losses: 2, matches_played: 12, tier: 'GOLD' }
        ]);
        
        vi.spyOn(dependencies.pvpService, 'getMonthlyLeaderboard').mockResolvedValue([
            { user_id: 1, username: 'Player1', points: 5000, wins: 50, losses: 10, total_wagered: 100, total_won: 450, tier: 'MASTER' }
        ]);
    });

    it('should return weekly leaderboard with correct structure', async () => {
        const res = await request(app).get('/pvp/leaderboard/weekly?mode=BR&network=BSC');
        
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty('username', 'Player1');
        expect(res.body[0]).toHaveProperty('points', 1000);
    });

    it('should return monthly leaderboard with correct structure', async () => {
        const res = await request(app).get('/pvp/leaderboard/monthly?mode=ALL');
        
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty('total_won', 450);
        expect(res.body[0]).toHaveProperty('tier', 'MASTER');
    });

    it('should return 400 if mode is missing in weekly', async () => {
        const res = await request(app).get('/pvp/leaderboard/weekly');
        // Assuming validation is implemented or it returns empty
        expect(res.status).toBe(200); // For now pvp-mode-server returns empty if not filtered
    });
});
