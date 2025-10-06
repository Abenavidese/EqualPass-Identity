// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// Minimal AccessControl implementation (OpenZeppelin-inspired but size-optimized)
contract AccessControl {
    mapping(bytes32 => mapping(address => bool)) private _roles;
    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
    
    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
    
    modifier onlyRole(bytes32 role) {
        require(hasRole(role, msg.sender), "AccessControl: account missing role");
        _;
    }
    
    function hasRole(bytes32 role, address account) public view returns (bool) {
        return _roles[role][account];
    }
    
    function _grantRole(bytes32 role, address account) internal {
        if (!hasRole(role, account)) {
            _roles[role][account] = true;
            emit RoleGranted(role, account, msg.sender);
        }
    }
}

// Minimal ERC721 implementation (OpenZeppelin-inspired but size-optimized)
contract ERC721 {
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    string private _name;
    string private _symbol;
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }
    
    function name() public view returns (string memory) { return _name; }
    function symbol() public view returns (string memory) { return _symbol; }
    function balanceOf(address owner) public view returns (uint256) { return _balances[owner]; }
    function ownerOf(uint256 tokenId) public view returns (address) { 
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: invalid token ID");
        return owner;
    }
    
    function _safeMint(address to, uint256 tokenId) internal {
        _owners[tokenId] = to;
        _balances[to]++;
        emit Transfer(address(0), to, tokenId);
    }
    
    function _ownerOf(uint256 tokenId) internal view returns (address) {
        return _owners[tokenId];
    }
    
    // Non-transferable: all transfer functions revert
    function approve(address, uint256) public pure { revert("Non-transferable"); }
    function getApproved(uint256) public pure returns (address) { return address(0); }
    function setApprovalForAll(address, bool) public pure { revert("Non-transferable"); }
    function isApprovedForAll(address, address) public pure returns (bool) { return false; }
    function transferFrom(address, address, uint256) public pure { revert("Non-transferable"); }
    function safeTransferFrom(address, address, uint256) public pure { revert("Non-transferable"); }
    function safeTransferFrom(address, address, uint256, bytes memory) public pure { revert("Non-transferable"); }
}

contract EqualPassIdentityBadge is ERC721, AccessControl {
    uint256 private _tokenIdCounter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    struct BadgeInfo {
        uint256 badgeType; // 1 para Estudiante
        uint256 issuedAt;
        address issuer;
    }

    mapping(uint256 => BadgeInfo) public badgeInfo;

    event BadgeMinted(address indexed to, uint256 indexed tokenId, uint256 badgeType, bytes32 claimId);

    constructor() ERC721("EqualPass Identity Badge", "EPIB") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function mintBadge(address to, uint256 badgeType, bytes32 claimId) public onlyRole(MINTER_ROLE) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(to, tokenId);

        badgeInfo[tokenId] = BadgeInfo({
            badgeType: badgeType,
            issuedAt: block.timestamp,
            issuer: msg.sender
        });

        emit BadgeMinted(to, tokenId, badgeType, claimId);
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "ERC721: URI query for nonexistent token");
        
        // Point to our backend metadata endpoint
        return string(abi.encodePacked("http://localhost:3000/api/metadata/", _toString(tokenId)));
    }
    
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function supportsInterface(bytes4 interfaceId) public pure returns (bool) {
        return interfaceId == 0x01ffc9a7 || // ERC165
               interfaceId == 0x80ac58cd || // ERC721
               interfaceId == 0x5b5e139f;   // ERC721Metadata
    }
}