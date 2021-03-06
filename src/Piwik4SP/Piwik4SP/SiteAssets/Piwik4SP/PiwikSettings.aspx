﻿<%@ Page Language="C#" Inherits="Microsoft.SharePoint.WebPartPages.WikiEditPage" MasterPageFile="~masterurl/default.master" MainContentID="PlaceHolderMain" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceHolderID="PlaceHolderPageTitle" runat="server">
    Piwik SiteSettings
</asp:Content>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Piwik SiteSettings
</asp:Content>
<asp:Content ContentPlaceHolderID="PlaceHolderPageImage" runat="server">
</asp:Content>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <SharePoint:ScriptLink runat="server" OnDemand="false" LoadAfterUI="false" Name="~site/SiteAssets/Piwik4SP/PiwikSettings.js" />
    <style type="text/css">
        .buttons {
            margin-left: 50%;
        }
        .button {
            display: inline-block;
            margin: 1em 5em 0 0;
            background: #eee;
            border: 2px solid gray;
            border-radius: 5px;
            padding: 10px 1em;
            cursor: pointer;
        }
        .button:hover{
            border-color: black;
        }
        .button.disabled {
            border-color: lightgray;
            color: lightgray;
            cursor: default;
        }
        .button.disabled:hover {
            border-color: lightgray;
        }
    </style>
</asp:Content>
<asp:Content ContentPlaceHolderID="PlaceHolderMiniConsole" runat="server">
</asp:Content>
<asp:Content ContentPlaceHolderID="PlaceHolderLeftActions" runat="server">
</asp:Content>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <div>
        The url to the Piwik installation is set to <input id="trackingUrl" type="text" disabled="disabled" readonly="readonly" value="loading..." />
        and the Tracking-Id is set to: <input id="trackingId" type="text" disabled="disabled" readonly="readonly" value="loading..." /> <br />
        If you leave one of the two empty, tracking for this site will be disabled.
        <div class="buttons">
            <div id="p-ok" class="button ok-button disabled">Save</div>
            <div id="p-cancel" class="button cancel-button disabled">Cancel</div>
        </div>
    </div>
</asp:Content>
