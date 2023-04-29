const { creditDataController } = require("./creditDataController");

describe("creditDataController", () => {
  it("should call creditDataResponse.send with correct parameter", async () => {
    // prepare
    const mockResult = [
      {
        ssn: "424-11-9327",
        data: '{"address":"8215 Westend Terrace","first_name":"Emma","last_name":"Gautrey","assessed_income":60668,"balance_of_debt":11585,"complaints":true}',
      },
    ];
    const mockdatabaseService = {
      selectData: jest.fn().mockImplementation(() => {
        return Promise.resolve(mockResult);
      }),
    };
    const mockGetCreditData = jest.fn();

    const mockCreditDataResponse = { send: jest.fn() };

    // act
    await creditDataController(
      mockdatabaseService,
      mockGetCreditData,
      "424-11-9327",
      mockCreditDataResponse
    );

    // assert
    expect(mockCreditDataResponse.send).toHaveBeenCalledWith({
      address: "8215 Westend Terrace",
      assessed_income: 60668,
      balance_of_debt: 11585,
      complaints: true,
      first_name: "Emma",
      last_name: "Gautrey",
    });
  });
});
