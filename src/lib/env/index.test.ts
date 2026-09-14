import { describe, expect, it } from 'vitest';
import { clerkEnvVars } from './index.js';

const PRIVATE_VARS = [
	'CLERK_SECRET_KEY',
	'CLERK_JWT_KEY',
	'CLERK_MACHINE_SECRET_KEY',
	'CLERK_WEBHOOK_SIGNING_SECRET',
	'CLERK_API_URL',
	'CLERK_API_VERSION'
] as const;

function validate(
	schema: { '~standard': { validate: (value: unknown) => unknown } },
	value: unknown
) {
	return schema['~standard'].validate(value) as { value: unknown };
}

describe('clerkEnvVars', () => {
	it('declares private vars without public or static', () => {
		const vars = clerkEnvVars();
		for (const name of PRIVATE_VARS) {
			const config = vars[name] as unknown as Record<string, unknown>;
			expect(config.public, name).toBeFalsy();
			expect(config.static, name).toBeFalsy();
		}
	});

	it('declares everything else as public and dynamic by default', () => {
		const vars = clerkEnvVars();
		for (const [name, config] of Object.entries(vars)) {
			if ((PRIVATE_VARS as readonly string[]).includes(name)) continue;
			expect(config.public, name).toBe(true);
			expect(config.static, name).toBe(false);
		}
	});

	it('marks only public vars static when static: true', () => {
		const vars = clerkEnvVars({ static: true });
		for (const [name, config] of Object.entries(vars)) {
			if ((PRIVATE_VARS as readonly string[]).includes(name)) {
				expect((config as unknown as Record<string, unknown>).static, name).toBeFalsy();
			} else {
				expect(config.static, name).toBe(true);
			}
		}
	});

	it('gives every var a schema and a description', () => {
		for (const [name, config] of Object.entries(clerkEnvVars())) {
			expect(config.schema, name).toBeDefined();
			expect(config.description, name).toBeTruthy();
		}
	});

	it('transforms boolean vars into real booleans', () => {
		const vars = clerkEnvVars();
		for (const name of [
			'CLERK_IS_SATELLITE',
			'CLERK_TELEMETRY_DISABLED',
			'CLERK_TELEMETRY_DEBUG'
		] as const) {
			expect(validate(vars[name].schema, 'true').value, name).toBe(true);
			expect(validate(vars[name].schema, '1').value, name).toBe(true);
			expect(validate(vars[name].schema, 'false').value, name).toBe(false);
			expect(validate(vars[name].schema, undefined).value, name).toBe(false);
		}
	});

	it('defaults CLERK_API_VERSION to v1', () => {
		const vars = clerkEnvVars();
		expect(validate(vars.CLERK_API_VERSION.schema, undefined).value).toBe('v1');
		expect(validate(vars.CLERK_API_VERSION.schema, '2025-04-10').value).toBe('2025-04-10');
	});

	it('passes optional string vars through, including undefined', () => {
		const vars = clerkEnvVars();
		expect(validate(vars.CLERK_SECRET_KEY.schema, undefined).value).toBeUndefined();
		expect(validate(vars.CLERK_SECRET_KEY.schema, 'sk_test_x').value).toBe('sk_test_x');
	});
});
