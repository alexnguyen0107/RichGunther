pragma solidity ^0.5.16;

import "./Gunther.sol";
import "./ERC721Full.sol";

contract Yugioh is ERC721Full {
    uint256 public decimals = 18;
    uint256[] public cards;
    uint256 public count = 0;
    uint256 public BASE_PRICE = 10000 * (10 ** decimals);
    uint256 public TOTAL_SUPPLY = 2000000;
    mapping(uint => Product) public products;

    constructor() ERC721Full("Yugioh", "YUGI") public {

    }
    struct Product {
        uint price;
        address owner;
        bool purchased;
    }

    event ProductCreated(
        uint tokenId,
        uint price,
        address seller,
        bool purchased
    );
    event ProductCancel(
        uint tokenId,
        uint price,
        address seller,
        bool purchased
    );
    event ProductPurchased(
        uint tokenId,
        uint price,
        address buyer,
        bool purchased
    );

    function mintN(address _token, uint number) public {
        if (number == 1) mint(_token);
        else if (number == 5) {
            mint(_token);
            mint(_token);
            mint(_token);
            mint(_token);
            mint(_token);
        }
        else if (number == 10) {
            mint(_token);
            mint(_token);
            mint(_token);
            mint(_token);
            mint(_token);
            mint(_token);
            mint(_token);
            mint(_token);
            mint(_token);
            mint(_token);
        }

    }

    function mint(address _token) public {
        require(count <= TOTAL_SUPPLY, "Total supply max 2,000,000");
//        uint256 amount = Gunther(_token).balanceOf(msg.sender);
        uint256 price = BASE_PRICE;
        if (price <= 500000)
            price = BASE_PRICE;
        else if (price <= 1000000)
            price = BASE_PRICE * 3/2;
        else if (price <= 1500000)
            price = BASE_PRICE * 2;
        else
            price = BASE_PRICE*5/2;
//        require(amount >= price);
        require(Gunther(_token).transferOwner(msg.sender, price),"Not enough balance");
        count++;
        cards.push(count);
        _mint(msg.sender, count);

    }

    function tokensOfOwner11() public view returns (uint256[] memory){
        return _tokensOfOwner(msg.sender);
    }

    function getPrice(uint256 tokenId) public view returns (uint256) {
        Product memory _product = products[tokenId];
        return _product.price;
    }

    function createProduct(uint256 tokenId, uint _price) public {

        // Require a valid price
        require(_price > 0);
        address seller = ownerOf(tokenId);
        require(seller == msg.sender);

        products[tokenId] = Product(_price, msg.sender, false);
        // Trigger an event
        emit ProductCreated(tokenId, _price, msg.sender, false);
    }

    function cancelProduct(uint256 tokenId) public {
        address seller = ownerOf(tokenId);
        require(seller == msg.sender);
        Product memory _product = products[tokenId];
        require(_product.purchased == false, "TokenId  don't sell");
        _product.purchased = true;
        products[tokenId] = _product;
        // Trigger an event
        emit ProductCancel(tokenId, _product.price, msg.sender, true);
    }

    function purchaseProduct(address _token, uint tokenId) public payable {
        // Fetch the product
        Product memory _product = products[tokenId];
        // Fetch the owner
        address _seller = _product.owner;
        require(_seller == ownerOf(tokenId), "address not owner");
        require(_seller != msg.sender, "seller is  buyer");
        require(_product.purchased == false, "TokenId  don't sell");


        uint256 amountBuyer = Gunther(_token).balanceOf(msg.sender);
        require(amountBuyer >= _product.price, "buyer not enough amount");
        //        // Require that the product has not been purchased already
        //        require(!_product.purchased);
        //        // Require that the buyer is not the seller

        Gunther(_token).transferFrom(msg.sender, address(this), _product.price);
        Gunther(_token).transfer(_seller, _product.price);
        //        require(Gunther(_token).transferFrom(msg.sender,_seller ,_product.price),"transer error");
        //        _isApprovedOrOwner(_seller,tokenId);
        _transferFrom(_seller, msg.sender, tokenId);
        // Transfer ownership to the buyer
        _product.owner = msg.sender;
        // Mark as purchased
        _product.purchased = true;
        // Update the product
        products[tokenId] = _product;

        // Trigger an event
        emit ProductPurchased(tokenId, _product.price, msg.sender, true);
    }
}
