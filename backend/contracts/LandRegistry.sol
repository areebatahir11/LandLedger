// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Counters.sol";

contract LandRegistry {
    using Counters for Counters.Counter;
    Counters.Counter private _landIDCounter;

    enum LandStatus {
        Verified,
        Disputed
    }

    enum saleStatus {
        sold,
        unsold
    }

    struct LandParcel {
        uint256 landID;
        address owner;
        uint256 area;
        string location;
        string plotNumber;
        string ipfsHash;
        LandStatus status;
        saleStatus salestatus;
        uint256 price; // 💰 Price of land in Wei (1 ETH = 10^18 Wei)
    }

    // Mappings
    mapping(uint256 => LandParcel) private landInfo;
    mapping(uint256 => address[]) private ownershipHistory;
    mapping(string => bool) private registeredIPFS;

    // Events
    event RegisteredLand(uint256 landID, address owner);
    event TransferredOwnership(uint256 landID, address from, address to);
    event LandStatusChanged(uint256 landID, LandStatus status);
    event LandVerified(uint256 landID, address admin);
    event LandDisputed(uint256 landID, address admin);

    // Modifiers
    modifier landExists(uint256 _landID) {
        require(landInfo[_landID].owner != address(0), "Land does not exist");
        _;
    }

    // 🏗 Register New Land
    function registerLand(
        uint256 _area,
        string memory _location,
        string memory _plotNumber,
        string memory _ipfsHash,
        uint256 _price // 👈 Pass initial price at registration
    ) public {
        require(!registeredIPFS[_ipfsHash], "Land with this document already registered");
        require(_price > 0, "Price must be greater than 0");

        uint256 newLandID = _landIDCounter.current();
        _landIDCounter.increment();

        landInfo[newLandID] = LandParcel(
            newLandID,
            msg.sender,
            _area,
            _location,
            _plotNumber,
            _ipfsHash,
            LandStatus.Verified,
            saleStatus.unsold,
            _price
        );

        ownershipHistory[newLandID].push(msg.sender);
        registeredIPFS[_ipfsHash] = true;

        emit RegisteredLand(newLandID, msg.sender);
    }

    // 💰 Purchase Land (payable)
    function purchaseLand(uint256 _landID) public payable landExists(_landID) {
        LandParcel storage land = landInfo[_landID];

        require(land.status == LandStatus.Verified, "Land must be verified");
        require(land.salestatus == saleStatus.unsold, "Land is not for sale");
        require(msg.sender != land.owner, "You already own this land");
        require(msg.value == land.price, "Incorrect ETH amount sent");

        address previousOwner = land.owner;

        // Transfer ownership
        land.owner = msg.sender;
        land.salestatus = saleStatus.sold;
        land.price = 0; // Reset price after sale

        ownershipHistory[_landID].push(msg.sender);

        // Transfer ETH to previous owner
        (bool sent, ) = payable(previousOwner).call{value: msg.value}("");
        require(sent, "ETH Transfer failed");

        emit TransferredOwnership(_landID, previousOwner, msg.sender);
    }

    // 📄 View Land Details
    function getLandDetails(
        uint256 _landID
    )
        public
        view
        landExists(_landID)
        returns (
            uint256,
            address,
            uint256,
            string memory,
            string memory,
            string memory,
            LandStatus,
            saleStatus,
            uint256
        )
    {
        LandParcel memory land = landInfo[_landID];
        return (
            land.landID,
            land.owner,
            land.area,
            land.location,
            land.plotNumber,
            land.ipfsHash,
            land.status,
            land.salestatus,
            land.price
        );
    }

    // 📜 View Ownership History
    function getOwnershipHistory(
        uint256 _landID
    ) public view landExists(_landID) returns (address[] memory) {
        return ownershipHistory[_landID];
    }

    // ⚠️ Mark Disputed
    function markAsDisputed(uint256 _landID) public landExists(_landID) {
        landInfo[_landID].status = LandStatus.Disputed;
        emit LandStatusChanged(_landID, LandStatus.Disputed);
        emit LandDisputed(_landID, msg.sender);
    }

    // 🔎 Get All Disputed Lands
    function getDisputedLands() public view returns (LandParcel[] memory) {
        uint256 total = _landIDCounter.current();
        uint256 count = 0;

        for (uint256 i = 0; i < total; i++) {
            if (landInfo[i].status == LandStatus.Disputed) {
                count++;
            }
        }

        LandParcel[] memory disputed = new LandParcel[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < total; i++) {
            if (landInfo[i].status == LandStatus.Disputed) {
                disputed[index] = landInfo[i];
                index++;
            }
        }

        return disputed;
    }

    // ✅ Verify Land
    function verifyLand(uint256 _landID) public landExists(_landID) {
        require(
            landInfo[_landID].salestatus == saleStatus.unsold ||
                landInfo[_landID].status == LandStatus.Disputed,
            "Only Unsold or Disputed land can be verified"
        );
        landInfo[_landID].status = LandStatus.Verified;
        emit LandStatusChanged(_landID, LandStatus.Verified);
        emit LandVerified(_landID, msg.sender);
    }

    // ✅ Verify & Remove Duplicates
    function verifyLandAndRemoveDuplicates(uint256 _landID) public landExists(_landID) {
        require(
            landInfo[_landID].salestatus == saleStatus.unsold ||
                landInfo[_landID].status == LandStatus.Disputed,
            "Only Unsold or Disputed land can be verified"
        );

        LandParcel storage landToVerify = landInfo[_landID];
        uint256 total = _landIDCounter.current();
        landToVerify.status = LandStatus.Verified;
        emit LandStatusChanged(_landID, LandStatus.Verified);
        emit LandVerified(_landID, msg.sender);

        for (uint i = 0; i < total; i++) {
            if (
                i != _landID &&
                keccak256(bytes(landInfo[i].plotNumber)) ==
                keccak256(bytes(landToVerify.plotNumber)) &&
                keccak256(bytes(landInfo[i].location)) ==
                keccak256(bytes(landToVerify.location))
            ) {
                delete landInfo[i];
            }
        }
    }

    // 👤 Get All Lands of an Owner
    function getMyLands(
        address _owner
    ) external view returns (LandParcel[] memory) {
        uint256 total = _landIDCounter.current();
        uint256 count = 0;

        for (uint256 i = 0; i < total; i++) {
            if (landInfo[i].owner == _owner) {
                count++;
            }
        }

        LandParcel[] memory lands = new LandParcel[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < total; i++) {
            if (landInfo[i].owner == _owner) {
                lands[index] = landInfo[i];
                index++;
            }
        }

        return lands;
    }

    // 🌍 Get All Lands
    function getAllLands() public view returns (LandParcel[] memory) {
        uint256 total = _landIDCounter.current();
        LandParcel[] memory lands = new LandParcel[](total);
        for (uint256 i = 0; i < total; i++) {
            lands[i] = landInfo[i];
        }
        return lands;
    }
}
