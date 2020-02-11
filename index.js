import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";

var constants = window.state;

class WeedCalculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = constants;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.computeTotalGrams = this.computeTotalGrams.bind(this);
    this.computeTotalDollars = this.computeTotalDollars.bind(this);
    this.calculateGrams = this.calculateGrams.bind(this);
    this.calculateDollars = this.calculateDollars.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  computeTotalGrams() {
    const funds = this.state.availableFunds;
    const grams = this.state.pricePerGram;
    const tax = this.state.totalTax;
    const discount = this.state.totalDiscount;
    const gramDiscount = (parseFloat(discount) / 100) * parseFloat(grams);
    const pricePerGramDiscount = parseFloat(grams) - parseFloat(gramDiscount);
    const pricePerGramDisTax =
      parseFloat(tax) / 100 + parseFloat(pricePerGramDiscount);

    const gramTax = (parseFloat(tax) / 100) * grams;
    const pricePerGramTaxTotal = parseFloat(gramTax) + parseFloat(grams);

    if (this.state.totalDiscount <= 0) {
      const total = parseFloat(funds) / parseFloat(pricePerGramTaxTotal);
      return parseFloat(total).toFixed(1);
    } else {
      const total = parseFloat(funds) / parseFloat(pricePerGramDisTax);
      return parseFloat(total).toFixed(1);
    }
  }

  computeTotalDollars() {
    const funds = this.state.availableGrams;
    const grams = this.state.pricePerGram;
    const tax = this.state.totalTax;
    const discount = this.state.totalDiscount;
    const gramDiscount = (parseFloat(discount) / 100) * parseFloat(grams);
    const pricePerGramDiscount = parseFloat(grams) - parseFloat(gramDiscount);
    const pricePerGramDisTax =
      parseFloat(tax) / 100 + parseFloat(pricePerGramDiscount);

    const gramTax = (parseFloat(tax) / 100) * grams;
    const pricePerGramTaxTotal = parseFloat(gramTax) + parseFloat(grams);

    if (this.state.totalDiscount <= 0) {
      const total = funds * parseFloat(pricePerGramTaxTotal);
      return parseFloat(total).toFixed(2);
    } else {
      const total = funds * parseFloat(pricePerGramDisTax);
      return parseFloat(total).toFixed(2);
    }
  }

  calculateGrams(event) {
    event.preventDefault();
    const total = this.computeTotalGrams();
    this.setState({ totalGrams: total });
  }

  calculateDollars(event) {
    event.preventDefault();
    const total = this.computeTotalDollars();
    this.setState({ totalDollars: total });
    //this.handleChange(this.totalDollars, total);
  }

  render() {
    const {
      availableFunds,
      availableGrams,
      pricePerGram,
      totalGrams,
      totalTax,
      totalDiscount,
      totalDollars
    } = this.state;
    return (
      <div className="app">
        <div className="header">
          <img className="WMlogo" src="/static/50x50.png" alt="logo" />
          <span className="h2">WeedMath</span>
        </div>
        <form>
          <fieldset>
            <div className="inputFieldsGroup">
              <select
                aria-label="calc-method"
                className="div-toggle"
                data-target=".my-info-1"
              >
                <option value="apple" data-show=".pome">
                  Get Cash Total
                </option>
                <option value="orange" data-show=".citrus">
                  Find Grams Possible
                </option>
              </select>
              <div className="inputFields">
                <label htmlFor="price-field">Gram Price:</label>
                <div className="prefix">$</div>
                <input
                  className="currency-input"
                  type="number"
                  maxLength="6"
                  step=".01"
                  id="price-field"
                  defaultValue={pricePerGram}
                  name="pricePerGram"
                  onChange={this.handleChange}
                />
              </div>

              <div className="my-info-1">
                <div className="citrus hide">
                  <div className="inputFields">
                    <label htmlFor="cash-field">Max Cash:</label>
                    <div className="prefix">$</div>
                    <input
                      className="currency-input"
                      type="number"
                      maxLength="6"
                      step=".01"
                      id="cash-field"
                      defaultValue={availableFunds}
                      name="availableFunds"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="pome hide">
                  <div className="inputFields">
                    <label htmlFor="totalGrams-field">Total Grams:</label>
                    <div className="prefix" />
                    <input
                      className="currency-input"
                      type="number"
                      maxLength="6"
                      step=".01"
                      id="totalGrams-field"
                      defaultValue={availableGrams}
                      name="availableGrams"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="inputFields">
                <label htmlFor="tax-field">Tax Percent:</label>
                <div className="prefix">%</div>
                <input
                  className="currency-input"
                  type="number"
                  maxLength="6"
                  step=".01"
                  id="tax-field"
                  defaultValue={totalTax}
                  name="totalTax"
                  onChange={this.handleChange}
                />
              </div>
              <div className="inputFields">
                <label htmlFor="discount-field">Discount:</label>
                <div className="prefix">%</div>
                <input
                  className="currency-input"
                  type="number"
                  maxLength="6"
                  step=".01"
                  id="discount-field"
                  defaultValue={totalDiscount}
                  name="totalDiscount"
                  onChange={this.handleChange}
                />
              </div>

              <div className="my-info-1">
                <div className="citrus hide">
                  <div className="buttonWrapper">
                    <input
                      className="calcBtn"
                      type="submit"
                      value="Calculate"
                      id="calcBtn"
                      onClick={event => this.calculateGrams(event)}
                    />
                  </div>
                </div>
                <div className="pome hide">
                  <div className="buttonWrapper">
                    <input
                      className="calcBtn"
                      type="submit"
                      value="Calculate"
                      onClick={event => this.calculateDollars(event)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="my-info-1">
              <div className="citrus hide">
                <div className="outputFields">
                  <label htmlFor="grams-field">Grams Possible:</label>
                  <input
                    type="text"
                    className="currency-output"
                    id="grams-field"
                    readOnly="readonly"
                    value={totalGrams}
                    name="totalGrams"
                    onChange={this.handleValueChange}
                  />
                </div>
              </div>
              <div className="pome hide">
                <div className="outputFields">
                  <label htmlFor="dollars-field">
                    Cash Total: &nbsp;&nbsp;&nbsp;&nbsp; $
                  </label>
                  <input
                    type="text"
                    className="currency-output"
                    id="dollars-field"
                    readOnly="readonly"
                    value={totalDollars}
                    name="totalDollars"
                    onChange={this.handleValueChange}
                  />
                </div>
              </div>
            </div>

            <div className="refCard">
              <div className="p1">
                <b>Reference:</b>
              </div>
              <div className="p2">
                ⅛ Ounce (eighth) = 3.5 Grams
                <br />
                ¼ Ounce (quarter) = 7 Grams
                <br />½ Ounce (half) = 14 Grams
              </div>
            </div>
          </fieldset>
        </form>
        <main>
          <div id="token_div">
            <button
              type="button"
              id="deleteToken"
              className="prettyBtn"
              label="Delete Token"
            >
              {"Disable Notifications"}
            </button>
          </div>
          <div id="permission_div">
            <button
              type="button"
              className="prettyBtn"
              id="requestPermission"
              label="Request Permission"
            >
              {"Enable Notifications"}
            </button>
          </div>
          <div hidden id="messages" className="messages" />
          <p id="token" />
        </main>
      </div>
    );
  }
}

$(document).on("change", ".div-toggle", function() {
  var target = $(this).data("target");
  var show = $("option:selected", this).data("show");
  $(target)
    .children()
    .addClass("hide");
  $(show).removeClass("hide");
});
$(document).ready(function() {
  $(".div-toggle").trigger("change");
});

ReactDOM.render(<WeedCalculator />, document.getElementById("root"));
