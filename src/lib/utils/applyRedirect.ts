/**
 * Checks if applications are open (past 3 PM EST on Monday, December 1, 2025)
 * @returns true if applications are open, false if still coming soon
 */
export function isApplicationOpen(): boolean {
	const now = new Date();
	
	// Create the target date: December 1, 2025 at 3:00 PM EST
	// EST is UTC-5, so 3 PM EST = 8 PM UTC (20:00 UTC)
	const targetDate = new Date('2025-12-01T20:00:00Z');
	
	return now >= targetDate;
}

/**
 * Gets the redirect URL for apply buttons
 * @returns '/apply' if applications are open, '/coming-soon' otherwise
 */
export function getApplyUrl(): string {
	return '/apply';
}

