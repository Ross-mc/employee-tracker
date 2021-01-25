const Department = require("../lib/department");

describe('Tests for new Department constructor', () => {
    test('Can instantiate new Department instance', () => {
        const d = new Department();
        expect(typeof d).toBe("object");
    });
});

describe('Can set properties via constuctor function', () => {
    test('Can set departmentName property', () => {
        const departmentName = "Sales";
        const d = new Department(departmentName);
        expect(d.departmentName).toBe(departmentName);
    });
});