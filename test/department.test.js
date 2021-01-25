// require Department constructor

describe('Tests for new Department constructor', () => {
    test('Can instantiate new Department instance', () => {
        const d = new Department();
        expect(typeof d).toBe("object")
    });
});

describe('Can set properties via constuctor function', () => {
    test('Can set deparmentName property', () => {
        const deparmentName = "Sales";
        const d = new Department(deparmentName);
        expect(d.deparmentName).toBe(deparmentName)
    });

})