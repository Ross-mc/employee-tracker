const Employee = require('../lib/employee');

describe('Tests for new employee constructor', () => {
    test('Can instantiate new employee instance', () => {
        const e = new Employee();
        expect(typeof e).toBe("object")
    });
});

describe('Can set properties via constuctor function', () => {
    test('Can set firstName property', () => {
        const firstName = "Steve";
        const e = new Employee(firstName);
        expect(e.first_name).toBe(firstName)
    });
    test('Can set lastName property', () => {
        const lastName = "Jobs"
        const e = new Employee("Steve", lastName);
        expect(e.last_name).toBe(lastName)
    });
    test('Can set roleId property', () => {
        const roleId = 3;
        const e = new Employee("Steve", "Jobs", 3);
        expect(e.roleId).toBe(3)
    });
})