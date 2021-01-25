// require Position constructor

describe('Tests for new Position constructor', () => {
    test('Can instantiate new Position instance', () => {
        const p = new Position();
        expect(typeof p).toBe("object")
    });
});

describe('Can set properties via constuctor function', () => {
    test('Can set title property', () => {
        const title = "Front End Developer";
        const p = new Position(title);
        expect(p.title).toBe(title)
    });
    test('Can set salary property', () => {
        const salary = 25000;
        const p = new Position("Front End Developer", salary);
        expect(p.salary).toBe(salary)
    });
    test('Can set departmentId property', () => {
        const departmentId = 3;
        const p = new Position("Front End Developer", 25000, 3);
        expect(p.departmentId).toBe(3)
    });
})