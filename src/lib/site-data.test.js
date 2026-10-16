import { describe, expect, test } from "bun:test";
import { booking, contact, donationAmounts } from "./site-data";

describe("HELPS approved booking and contact rules", () => {
  test("individual booking fee is £17.50", () => expect(booking.individualFee).toBe(17.50));
  test("couple booking fee is £25.50", () => expect(booking.coupleFee).toBe(25.50));
  test("sessions last 50 minutes", () => expect(booking.durationMinutes).toBe(50));
  test("donation presets are £10, £25 and £50", () => expect([...donationAmounts]).toEqual([10, 25, 50]));
  test("removed phone is not offered", () => expect(contact.phones).toEqual(["+447958424280", "+447403207697"]));
  test("uses the Peterborough address", () => expect(contact.address).toBe("116 Saxonbury Way, Peterborough, PE2 9FB"));
});